import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from io import BytesIO
import base64
from pathlib import Path
from dotenv import load_dotenv
import qrcode

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

def generate_qr_base64(data: str) -> str:
    """
    Генерирует QR-код из строки и возвращает его в формате base64.

    :param data: Строка для кодирования в QR-код.
    :return: Base64-строка изображения QR-кода.
    """
    qr = qrcode.QRCode(
        version=1,  # Размер QR-кода (1 - минимальный, увеличивается при необходимости)
        error_correction=qrcode.constants.ERROR_CORRECT_L,  # Минимальная коррекция ошибок
        box_size=10,  # Размер каждой "ячейки" QR-кода
        border=4  # Отступ по краям
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill="black", back_color="white")

    # Сохраняем изображение в буфер
    buffer = BytesIO()
    img.save(buffer, format="PNG")

    # Кодируем изображение в base64
    base64_qr = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return base64_qr


def base64_to_image_stream(base64_string):
    image_bytes = base64.b64decode(base64_string)
    image_stream = BytesIO(image_bytes)
    return image_stream

class EmailQrCodeSender:
    def __init__(self, smtp_server=None, smtp_port=None):
        self.smtp_server = smtp_server or os.getenv("SMTP_SERVER", "bp@urfu.ru")
        self.smtp_port = smtp_port or int(os.getenv("SMTP_PORT", 587))
        self.email = os.getenv("SMTP_EMAIL", "")
        self.password = os.getenv("SMTP_PASSWORD", "")

        if not self.email or not self.password:
            raise ValueError("Не заданы учетные данные для SMTP. Проверьте переменные окружения SMTP_EMAIL и SMTP_PASSWORD.")


    def send_accept(self, id_of_request, recipient_email):
        msg = MIMEMultipart()
        msg['From'] = "Prohod <>"
        msg['To'] = recipient_email
        msg['Subject'] = "Пропуск в ИРИТ-РТФ"

        base64_qr_code = generate_qr_base64(id_of_request)

        html_content = """
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
                <p>Здравствуйте!</p>
                <p>Ваша заявка на пропуск в <strong>ИРИТ-РТФ</strong> успешно одобрена.</p>
                <p>Пожалуйста, выполните следующие действия в день визита:</p>
                <ol>
                    <li>Подойдите в холл к охране в день, на который одобрена заявка.</li>
                    <li>Предъявите QR-код (ниже) и ваше удостоверение личности.</li>
                    <li>Дождитесь проверки документов.</li>
                </ol>
                <p style="margin-top:20px">Ваш QR-код для входа:</p>
                <div style="text-align:center;margin:20px 0">
                    <img src="cid:qr.png" alt="QR код" style="width:200px;height:200px">
                </div>
                <p>Благодарим за использование сервиса <strong>Проход</strong>!</p>
                <hr style="border:none;border-top:1px solid #ccc;margin:20px 0">
                <small style="color:#777">Это автоматическое письмо. Пожалуйста, не отвечайте на него.</small>
            </div>
            """
        # Добавляем текст в тело письма
        body = MIMEText(html_content, "html")
        msg.attach(body)

        # Преобразуем base64 строку в изображение
        image_stream = base64_to_image_stream(base64_qr_code)
        image = MIMEImage(image_stream.read(), name="qr.png")
        image.add_header('Content-ID', '<qr.png>')
        msg.attach(image)

        # Отправка письма через SMTP
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.email, self.password)
            server.sendmail(self.email, recipient_email, msg.as_string())

    def send_reject(self, recipient_email, reject_reason):
        msg = MIMEMultipart()
        msg['From'] = "Prohod <>"
        msg['To'] = recipient_email
        msg['Subject'] = "Результат рассмотрения вашей заявки на пропуск в ИРИТ-РТФ"

        # HTML-содержимое письма
        html_content = f"""
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
            <p>Здравствуйте!</p>
            <p>К сожалению, ваша заявка на получение пропуска в <strong>ИРИТ-РТФ</strong> не была одобрена.</p>
            <p><strong>Причина отказа:</strong></p>
            <blockquote style="border-left:4px solid #dc3545;padding-left:10px;color:#555;margin:10px 0">
                {reject_reason}
            </blockquote>
            <p>Если вы считаете, что произошла ошибка, вы можете подать новую заявку или обратиться в службу поддержки.</p>
            <p style="margin-top:20px">Благодарим за понимание!</p>
            <hr style="border:none;border-top:1px solid #ccc;margin:20px 0">
            <small style="color:#777">Это автоматическое письмо. Пожалуйста, не отвечайте на него.</small>
        </div>
        """

        body = MIMEText(html_content, "html")
        msg.attach(body)

        # Отправка письма через SMTP
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.email, self.password)
            server.sendmail(self.email, recipient_email, msg.as_string())

    def send_verify_code(self, code: str, recipient_email):
        msg = MIMEMultipart()
        msg['From'] = "Prohod <>"
        msg['To'] = recipient_email
        msg['Subject'] = "Код подтверждения для сервиса \"Проход\""
        verification_code = code
        html_content = """
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
        <p>Здравствуйте!</p>
        <p>Вы заполнили форму на сайте <strong>Проход</strong>. Для завершения отправки данных, пожалуйста, подтвердите ваш email с помощью кода:</p>
        <h2 style="color:#007bff">Ваш код подтверждения: {verification_code}</h2>
        <p>Введите этот код в соответствующее поле на сайте в течение <strong> 3 </strong> минут.</p>
        <p>Если вы не заполняли форму на нашем сайте, просто проигнорируйте это письмо — возможно, кто-то случайно указал ваш email.</p>
        <p>Благодарим за доверие!</p>
        <p style="margin-top:20px">С уважением,<br>Команда <strong>Проход</strong></p>
        <hr style="border:none;border-top:1px solid #ccc;margin:20px 0">
        <small style="color:#777">Это автоматическое письмо. Пожалуйста, не отвечайте на него.</small>
        </div>
        """.format(verification_code=verification_code)

        # Добавляем текст в тело письма
        body = MIMEText(html_content, "html")
        msg.attach(body)

        # Отправка письма через SMTP
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.email, self.password)
            server.sendmail(self.email, recipient_email, msg.as_string())



