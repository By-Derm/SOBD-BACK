import {google} from "googleapis";


function createObjectsFromArrays(arrays) {
  if (arrays.length === 0) return [];

  const headers = arrays[0];
  const result = [];

  for (let i = 1; i < arrays.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = arrays[i][j];
    }
    result.push(obj);
  }

  return result;
}


export const getAll = async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./google.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1e05Kr5jNMqQm_FqPDZ8LM5WNKhb4PyN19QokHL2UiTQ";
    const range = `Página1!A1:S1000000`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    
    res.send(createObjectsFromArrays(rows));
  } catch (error) {
    console.log(error);
  }
};
