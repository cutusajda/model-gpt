import axios from "axios";

const ApiService = async (input) => {
  // const options_gpt4 = {
  //   method: "POST",
  //   url: "https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask",
  //   headers: {
  //     "content-type": "application/json",
  //     "X-RapidAPI-Key": "c9932d415bmsh385775b305b08f4p10caefjsn600b45d92f9c",
  //     "X-RapidAPI-Host": "chatgpt-gpt4-ai-chatbot.p.rapidapi.com",
  //   },
  //   data: {
  //     query: input,
  //   },
  // };

  // const options_gpt3_5 =  {
  //       method: 'POST',
  //       url: 'https://chatgpt-free.p.rapidapi.com/chat',
  //       headers: {
  //         'content-type': 'application/json',
  //         'X-RapidAPI-Key': 'c9932d415bmsh385775b305b08f4p10caefjsn600b45d92f9c',
  //         'X-RapidAPI-Host': 'chatgpt-free.p.rapidapi.com'
  //       },
  //       data: {
  //         past_conversations: [
  //           {
  //             role: 'user',
  //             content: input
  //           }
  //         ]
  //       }
  //     };

  const options_gpt4_turbo_vision = {
    method: "POST",
    url: "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
    // url: "",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "56de684541msh2f8845fc14c2dd4p16d205jsn386531eb3949",
      "X-RapidAPI-Host":
        "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com",
    },
    data: {
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
      model: "gpt-4-turbo-preview",
      max_tokens: 200,
      temperature: 0.9,
    },
  };

  try {
    const response = await axios.request(options_gpt4_turbo_vision);
    return response.data?.choices[0]?.message?.content;
  } catch (error) {
    console.error(error);
  }
};

export default ApiService;
