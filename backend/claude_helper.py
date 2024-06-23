# set up model
from langchain_anthropic import ChatAnthropic
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate

ANTHROPIC_API_KEY='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'

# note that total_prompt = 
def call_claude(total_prompt, api_key=ANTHROPIC_API_KEY, model_name="claude-3-5-sonnet-20240620", temperature=0, num_predict=100, storeMemory=True):
    llm = ChatAnthropic(api_key=api_key, model=model_name, temperature=temperature, max_tokens=num_predict)
    total_prompt = "You are an all knowing AI Mentor with the goal of helping students in a compassionate way. " + total_prompt
    total_prompt_template = PromptTemplate(template=total_prompt) # modify total prompt to include the prefix
    if storeMemory:
        chain = LLMChain(
            llm = llm,
            prompt=total_prompt_template,
            verbose=True,
            memory=ConversationBufferMemory()
        )
    else:
        chain = total_prompt | llm
    
    output = chain.invoke({input : total_prompt}).content

    return output

# def call_claude(system_prompt, user_prompt, max_tokens=100, temperature=0):
#     client = anthropic.Anthropic()
#     message = client.messages.create(
#         model="claude-3-5-sonnet-20240620",
#         max_tokens=max_tokens,
#         temperature=temperature,
#         system="You are an all knowing AI Mentor with the goal of helping students in a compassionate way. "
#                + system_prompt,
#         messages=[
#             {
#                 "role": "user",
#                 "content": [
#                     {
#                         "type": "text",
#                         "text": user_prompt
#                     }
#                 ]
#             }
#         ]
#     )

#     return message.content[0].text