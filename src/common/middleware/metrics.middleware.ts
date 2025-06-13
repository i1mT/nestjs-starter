import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { Counter, Histogram, register } from "prom-client";

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private static httpRequestsTotal: Counter<string>;
  private static httpRequestDuration: Histogram<string>;
  private static httpRequestsErrors: Counter<string>;

  constructor() {
    // 使用静态属性确保指标只被创建一次
    if (!MetricsMiddleware.httpRequestsTotal) {
      try {
        MetricsMiddleware.httpRequestsTotal = new Counter({
          name: "http_requests_total",
          help: "Total number of HTTP requests",
          labelNames: ["method", "route"],
          registers: [register],
        });
      } catch (error) {
        MetricsMiddleware.httpRequestsTotal = register.getSingleMetric(
          "http_requests_total"
        ) as Counter<string>;
      }
    }

    if (!MetricsMiddleware.httpRequestDuration) {
      try {
        MetricsMiddleware.httpRequestDuration = new Histogram({
          name: "http_request_duration_seconds",
          help: "Duration of HTTP requests in seconds",
          labelNames: ["method", "route", "status_code"],
          buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
          registers: [register],
        });
      } catch (error) {
        MetricsMiddleware.httpRequestDuration = register.getSingleMetric(
          "http_request_duration_seconds"
        ) as Histogram<string>;
      }
    }

    if (!MetricsMiddleware.httpRequestsErrors) {
      try {
        MetricsMiddleware.httpRequestsErrors = new Counter({
          name: "http_requests_errors_total",
          help: "Total number of HTTP request errors",
          labelNames: ["method", "route", "status_code", "error_type"],
          registers: [register],
        });
      } catch (error) {
        MetricsMiddleware.httpRequestsErrors = register.getSingleMetric(
          "http_requests_errors_total"
        ) as Counter<string>;
      }
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    // 跳过 metrics 端点
    if (req.baseUrl.startsWith("/api/metrics")) {
      return next();
    }

    const startTime = Date.now();
    const method = req.method;
    const route = this.getRouteFromUrl(req.baseUrl);

    // 监听响应完成事件
    res.on("finish", () => {
      const duration = (Date.now() - startTime);
      const statusCode = res.statusCode.toString();

      // 记录请求总数
      MetricsMiddleware.httpRequestsTotal.inc({
        method,
        route,
      });

      // 记录响应时间
      MetricsMiddleware.httpRequestDuration.observe(
        {
          method,
          route,
          status_code: statusCode,
        },
        duration
      );

      // 如果是错误响应，记录错误
      if (res.statusCode >= 400) {
        MetricsMiddleware.httpRequestsErrors.inc({
          method,
          route,
          status_code: statusCode,
          error_type: this.getErrorType(res.statusCode),
        });
      }
    });

    next();
  }

  private getRouteFromUrl(url: string): string {
    // 移除查询参数
    const path = url.split("?")[0];

    // 简单的路由模式匹配（可以根据需要改进）
    // 例如：/user/123 -> /user/:id
    const segments = path.split("/").filter((segment) => segment);
    let count = 0;
    const normalizedRoute = segments
      .map((segment) => {
        // 如果是数字，替换为参数
        if (/^\d+$/.test(segment)) {
          count++;
          return `:id${count}`;
        }
        // 如果是 UUID 格式，替换为参数
        if (
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            segment
          )
        ) {
          count++;
          return `:uuid${count}`;
        }
        return segment;
      })
      .join("/");

    return normalizedRoute ? `/${normalizedRoute}` : "/";
  }

  private getErrorType(statusCode: number): string {
    if (statusCode >= 400 && statusCode < 500) {
      return "ClientError";
    } else if (statusCode >= 500) {
      return "ServerError";
    }
    return "UnknownError";
  }
}