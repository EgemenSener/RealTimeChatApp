$(document).ready(function () {
    let stompClient = null;
    let timeoutHandle = null;

    // WebSocket bağlantısı başlatıyoruz
    function connectWebSocket() {
        const socket = new SockJS('/ws'); // WebSocket endpoint
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function () {
            console.log("WebSocket bağlantısı başarılı!");

            // Bağlantıyı kapatmak için timeout
            timeoutHandle = setTimeout(function () {
                console.log("Doğrulama süresi doldu. WebSocket bağlantısı kapatılıyor.");
                stompClient.disconnect(); // Bağlantıyı kapat
                window.location.href = "error.html";
            }, 30000); // 30 saniye

            // Bildirimleri dinliyoruz
            stompClient.subscribe('/topic/refresh', function (message) {
                console.log("Bildirim alındı: " + message.body);

                if (message.body.includes("Kullanici dogrulandi")) {
                    window.location.href = "https://blog.bioaffix.com/";
                }
            });

            // Keep-alive pingi
            setInterval(() => {
                stompClient.send("/app/keepAlive", {}, "ping");
            }, 3000);
        });
    }

    $("#loginForm").on("submit", function (e) {
        e.preventDefault(); // Sayfa yönlendirmesini engelliyoruz

        const userId = $("#userId").val();

        if (!userId) {
            $("#responseMessage").html('<div class="alert alert-danger">Kullanıcı adı boş olamaz!</div>');
            return;
        }

        $.ajax({
            url: "/api/login",
            type: "POST",
            data: { userId: userId },
            success: function (response) {
                $("#responseMessage").html('<div class="alert alert-success">Giriş başarılı lütfen doğrulama sonucunu bekleyiniz!</div>');

                // WebSocket bağlantısını başlat
                if (!stompClient) {
                    connectWebSocket();
                }
            },
            error: function () {
                $("#responseMessage").html('<div class="alert alert-danger">Giriş başarısız! Lütfen tekrar deneyin.</div>');
            },
        });
    });
});