import { Module } from '@nestjs/common'
import { LLMController } from './llm.controller'
import { LLMService } from './llm.service'
import { LangChainRouter } from 'services/langchain.service'

@Module({
  controllers: [LLMController],
  providers: [LLMService, LangChainRouter],
})
export class LLMModule {}
