function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || "{}");
    var expectedSecret = PropertiesService.getScriptProperties().getProperty("APP_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
    }

    var spreadsheetId = payload.spreadsheetId;
    var tab = payload.tab;
    var action = payload.action;

    if (!spreadsheetId || !tab || !action) {
      return jsonResponse({ ok: false, error: "Missing required fields" }, 400);
    }

    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(tab);
    if (!sheet) {
      return jsonResponse({ ok: false, error: "Tab not found" }, 404);
    }

    if (action === "append") {
      return handleAppend(sheet, payload.row || {});
    }

    if (action === "update") {
      return handleUpdate(sheet, payload.rows || []);
    }

    return jsonResponse({ ok: false, error: "Unsupported action" }, 400);
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) }, 500);
  }
}

function handleAppend(sheet, rowObject) {
  var headers = getHeaders(sheet);
  var values = headers.map(function(header) {
    return rowObject[header] || "";
  });
  sheet.appendRow(values);
  return jsonResponse({ ok: true });
}

function handleUpdate(sheet, rows) {
  var headers = getHeaders(sheet);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  if (rows.length > 0) {
    var values = rows.map(function(rowObject) {
      return headers.map(function(header) {
        return rowObject[header] || "";
      });
    });
    sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  }

  return jsonResponse({ ok: true });
}

function getHeaders(sheet) {
  var lastColumn = sheet.getLastColumn();
  if (lastColumn === 0) {
    throw new Error("Sheet requires a header row");
  }
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function(cell) {
    return String(cell).trim();
  });
}

function jsonResponse(body, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
