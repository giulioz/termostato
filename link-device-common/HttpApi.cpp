#include "HttpApi.hpp"
#include <ArduinoJson.h>
#include "Config.hpp"
#include "Connection.hpp"
#include "Constants.hpp"
#include "DataManager.hpp"

#include <ESP8266WebServer.h>
static ESP8266WebServer server(HTTPAPI_PORT);

static void handleNotFound() { server.send(404, "text/plain", "Not Found"); }

static void handleError(const char* error) {
  server.send(500, "text/plain", error);
}

// GET /connection
static void handleGetConnection() {
  StaticJsonBuffer<JSON_OBJECT_SIZE(2)> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  const Config::ConfigModel* config = Config::get();
  root["connected"] = config->WIFI_CONFIGURED;
  root["ssid"] = config->WIFI_SSID;

  String json;
  root.printTo(json);
  server.send(200, "application/json", json);
}

// POST /connection
static void handlePostConnection() {
  StaticJsonBuffer<JSON_OBJECT_SIZE(3) + 30> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(server.arg("plain"));
  String ssid = root["ssid"];
  String password = root["password"];
  server.send(200, "text/plain", "Rebooting...");
  Connection::connectAndReboot(ssid.c_str(), password.c_str());
}

// GET /version
static void handleGetVersion() {
  server.send(200, "text/plain", String(FIRMWARE_VERSION));
}

// GET /identifier
static void handleGetIdentifier() {
  server.send(200, "text/plain", String(Config::get()->IDENT));
}

// POST /identifier
static void handlePostIdentifier() {
  Config::ConfigModel newConfig = *Config::get();
  strncpy(newConfig.IDENT, server.arg("plain").c_str(), CONFIG_IDENT_LENGTH);
  newConfig.IDENT[CONFIG_IDENT_LENGTH - 1] = 0;

  if (Config::set(&newConfig)) {
    server.send(200, "text/plain", "Saved");
  } else {
    handleError("Cannot save settings");
  }
}

// GET /data
static void handleGetData() {
  StaticJsonBuffer<JSON_ARRAY_SIZE(PROVIDERS_COUNT) +
                   PROVIDERS_COUNT * JSON_OBJECT_SIZE(10)>
      jsonBuffer;
  JsonArray& root = jsonBuffer.createArray();

  for (int i = 0; DataManager::getProvider(i); i++) {
    JsonObject& child = root.createNestedObject();
    child["identifier"] = DataManager::getProvider(i)->getIdentifier();
    child["value"] = DataManager::getProvider(i)->getData();
  }

  String json;
  root.printTo(json);
  server.send(200, "application/json", json);
}

// POST /data
static void handleSetData() {
  StaticJsonBuffer<JSON_OBJECT_SIZE(3) + 30> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(server.arg("plain"));

  for (int i = 0; DataManager::getProvider(i); i++) {
    String ident = root["identifier"];
    if (strcmp(ident.c_str(), DataManager::getProvider(i)->getIdentifier()) ==
        0) {
      DataManager::getProvider(i)->setData(root["value"]);
    }
  }

  server.send(200);
}

void HttpApi::init() {
  server.onNotFound(handleNotFound);
  server.on("/connection", HTTP_GET, handleGetConnection);
  server.on("/connection", HTTP_POST, handlePostConnection);
  server.on("/version", HTTP_GET, handleGetVersion);
  server.on("/identifier", HTTP_GET, handleGetIdentifier);
  server.on("/identifier", HTTP_POST, handlePostIdentifier);
  server.on("/data", HTTP_GET, handleGetData);
  server.on("/data", HTTP_POST, handleSetData);

  server.begin();
}

void HttpApi::handle() { server.handleClient(); }
