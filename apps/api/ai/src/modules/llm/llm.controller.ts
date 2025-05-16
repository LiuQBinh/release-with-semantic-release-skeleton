import { Body, Controller, Post, Get } from '@nestjs/common'
import { LangChainRouter } from 'services/langchain.service'

@Controller({
  path: 'llm',
  version: '1',
})
export class LLMController {
  constructor(private langChainRouter: LangChainRouter) {}

  @Post('run')
  async run(@Body('prompt') prompt: any) : Promise<any>{
    return await this.langChainRouter.run(prompt)
  }

  @Get('test-api')
  async testApi(): Promise<any> {
    return { message: 'API is working!' }
  }
}
