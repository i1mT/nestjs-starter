import { PlainTextRoute } from "@/common/decorator/setMetadata";
import { Body, Controller, Get, Query, Sse } from "@nestjs/common";
import { ChatRequestDto } from "./interface";
import { AiChatService } from "./ai-chat.service";

@Controller("ai-chat")
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Sse("completions")
  @PlainTextRoute()
  async chat(@Query("message") message: string) {
    const body: ChatRequestDto = {
      message,
    };
    return this.aiChatService.completions(body);
  }
}