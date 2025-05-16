import { ChatOpenAI } from '@langchain/openai'
import { ChatAnthropic } from '@langchain/anthropic'

export class LangChainRouter {
  async run(prompt: string): Promise<any> {
    let model
    if (prompt.includes('code')) model = new ChatOpenAI({ temperature: 0.7 })
    else model = new ChatAnthropic({ temperature: 0.7 })

    const res = await model.invoke(prompt)
    return { provider: model.constructor.name, response: res.content }
  }
}
