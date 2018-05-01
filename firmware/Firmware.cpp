#include "Firmware.hpp"

#define DEBUG

const char* configPath = "/config";

// Constructor
Firmware::Firmware() :
    config(configPath, FileIO::GetDefault()),
    scheduler(),
    tempSensor(config.sensorPin, config.sensorResolution),
    thermostat(config.relayPin, &tempSensor, static_cast<TimeProvider*>(NTPTimeProvider::GetDefault()), &config),
    webServer(80) {

    // Spawn threads
    scheduler.AddThread(static_cast<Updateable*>(&tempSensor));
    scheduler.AddThread(static_cast<Updateable*>(&thermostat));
}

// Destructor
Firmware::~Firmware() {
}

// WiFi and OTA
void Firmware::InitNetwork(const char* ssid, const char* password,
    const IPAddress server_ip, const IPAddress gateway_ip, const IPAddress subnet_mask, const IPAddress dns_ip) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    WiFi.config(server_ip, gateway_ip, subnet_mask, dns_ip);
    #ifdef DEBUG
    Serial.print("\n\nTrying to connect to ");
    Serial.println(ssid);
    #endif
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
    #ifdef DEBUG
    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    #endif
    ArduinoOTA.begin();
}

// Web Server
void Firmware::InitWebServer() {
    // GET /thermostat/mode
    webServer.on("/thermostat/mode", HTTP_GET, [this](){
        if (config.autoMode) {
            webServer.send(200, "text/json", "\"auto\"");
        } else {
            webServer.send(200, "text/json", config.manualOnOff ? "\"on\"" : "\"off\"");
        }
    });
    // POST /thermostat/mode
    webServer.on("/thermostat/mode", HTTP_POST, [this](){
        bool ok = false;
        if (webServer.arg("plain").equals("\"on\"")) {
            config.manualOnOff = true;
            ok = true;
        } else if (webServer.arg("plain").equals("\"off\"")) {
            config.manualOnOff = false;
            ok = true;
        } else if (webServer.arg("plain").equals("\"auto\"")) {
            config.autoMode = true;
            ok = true;
        }

        if (ok && config.Save(configPath, FileIO::GetDefault())) {
            webServer.send(200);
        } else {
            webServer.send(500);
        }
    });

    // GET /thermostat/program
    webServer.on("/thermostat/program", HTTP_GET, [this](){
        StaticJsonBuffer<JSON_ARRAY_SIZE(24)> jsonBuffer;
        JsonArray& data = jsonBuffer.createArray();
        for (const auto& val : config.targetTemps) {
            data.add(val);
        }
        String jsonRes;
        data.printTo(jsonRes);
        webServer.send(200, "text/json", jsonRes);
    });

    // GET /stats/temperature
    webServer.on("/stats/temperature", HTTP_GET, [this](){
        webServer.send(200, "text/json", String(tempSensor.GetCurrentTemp()));
    });
    // GET /stats/time
    webServer.on("/stats/time", HTTP_GET, [this](){
        webServer.send(200, "text/json", String(NTPTimeProvider::GetDefault()->GetHour()));
    });

    // GET /settings
    webServer.on("/settings", HTTP_GET, [this](){
        char out[sizeof(Config)] = "error";
        Base64::Encode(reinterpret_cast<char*>(&config), sizeof(Config), out, sizeof(Config));
        webServer.send(200, "text/json", out);
    });

    webServer.begin();
}

// Init
void Firmware::Init() {
    #ifdef DEBUG
    // Serial debug
    Serial.begin(115200);
    Serial.setDebugOutput(true);
    #endif

    // Network
    IPAddress server_ip (172, 16, 14, 1);
    IPAddress dns_ip (8, 8, 8, 8);
    IPAddress gateway_ip (172, 16, 0, 1);
    IPAddress subnet_mask(255, 255, 0, 0);
    InitNetwork("ZausaNet", "clzausa58", server_ip, gateway_ip, subnet_mask, dns_ip);

    // Time
    NTPTimeProvider::GetDefault()->Config(config.timeZone, 60);

    // Web Server
    InitWebServer();
}

// Update
void Firmware::Update() {
    webServer.handleClient();
    ArduinoOTA.handle();
    scheduler.Update();
}
