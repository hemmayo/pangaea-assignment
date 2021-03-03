const { MONGO_URL } = process.env;

export const dbConnection = {
  url: MONGO_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
