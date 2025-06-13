import { Injectable, MessageEvent } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { ChatRequestDto } from "./interface";
import { Observable, pipe } from "rxjs";


@Injectable()
export class AiChatService {
  private readonly openai: OpenAI;
  private readonly model: string = "qwen-turbo";

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get("aliyun.bailian.sk");
    this.openai = new OpenAI({
      apiKey,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });
  }

  async completions(body: ChatRequestDto): Promise<Observable<MessageEvent>> {
    console.log(body);
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        {role: "system", content: "你是一个AI助手，请根据用户的问题给出回答。你的回答使用json返回，格式为：{ content: string }"},
        {role: "user", content: body.message},
      ],
      stream: true,
      response_format: { type: "json_object" },
    });

    return new Observable<MessageEvent>((observer) => {
      (async () => {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta.content;
          if (content) {
            observer.next({
              data: content,
            });
          }
        }
        observer.complete();
      })();
    });
  }
}