const { format } = require("sql-formatter");
const { Parser } = require("node-sql-parser");

module.exports.handler = async (event) => {
  const { sql_data, ...params } = JSON.parse(event.body);

  const modernMode = params.modern_mode;

  const createFormat = (sql, config) => {
    return format(sql, config);
  };

  const modernizedData = (language, sqlData) => {
    const opt = {
      database: language.toLowerCase(),
    };

    const parser = new Parser();
    const ast = parser.astify(sqlData);
    const sql = parser.sqlify(ast, opt);

    return sql;
  };

  const sqlConfig = {
    language: params.language,
    tabWidth: params.tab_width,
    keywordCase: params.key_wordCase,
  };

  const sqlData = modernMode
    ? modernizedData(sqlConfig.language, sql_data)
    : sql_data;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: createFormat(sqlData, sqlConfig),
      input: event,
    }),
  };
};
