FROM eclipse-mosquitto:2.0

# 設定ファイルをコピー
COPY config/mosquitto.conf /mosquitto/config/mosquitto.conf

# 永続データおよびログ用のディレクトリ権限設定
RUN mkdir -p /mosquitto/data /mosquitto/log && \
    chown -R mosquitto:mosquitto /mosquitto/data /mosquitto/log

# MQTT (1883) および WebSocket (9001) ポートを公開
EXPOSE 1883 9001

CMD ["/usr/sbin/mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]
