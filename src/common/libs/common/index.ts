import { config } from "@/config";

export async function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), duration);
  });
}

export function getDateString() {
  return new Date().toISOString().slice(0, 10);
}

// 将本地绝对路径换成url地址
export function transformLocalPathToUrl(path: string) {
  return path.replace(
    config.get("localFilePath"),
    `${config.get("serverUrl")}`
  );
}
