# Python

1. Install Anaconda
2. Create a new python 3.12 environment
3. Activate conda env
4. On VS code install following
   - Pylint
   - Python
   - Pylance
   - Mypy Type Checker
   - Mypy
   - Jupyter
   - Jupyter Slide Show
   - Jupyter Notebook Renderers
   - Jupyter Keymap
   - Jupyter Cell Tags
   - Black Formatter
5. In conda env install the following
   - pip install mypy

---
# LangChain
    - a framework to combine LLM with external source of compute or data
    - available in python or javascript
    - GPT4 can answer general questions
    - in case we need to work with the personal data langchain helps us to connect with it
    - LangChain can take the actions based on data
    - doc to chunks to vector db. data stored is the vector representation of the text
    - question to model, to chunks and then search the db for similarity
    - feed similar chunks to LLM
    - components
        - llm wrapper
        - prompt template
        - indexes for info ratrival
    - Chains
        - combine components to solve problems
    - Agents
        - allow llm to intract with the API
Installations
    - pip install python-dotenv
    - pip install langchain
    - pip install pinecone-client
    - pip install tiktoken
    - pip install openai