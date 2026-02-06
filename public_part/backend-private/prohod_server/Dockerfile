FROM python:3.12-alpine
WORKDIR /app
COPY ./ ./
RUN pip install -r ./requirements.txt
RUN pip install fastapi uvicorn
RUN alembic upgrade head
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8078"]
EXPOSE 8079:8079