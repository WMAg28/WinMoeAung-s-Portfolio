import time
from apscheduler.schedulers.background import BackgroundScheduler
from weather_collector import collect_weather_data

def start_scheduler():
  print("Starting the automated weather scheduler...")
  scheduler = BackgroundScheduler()
  scheduler. add_job(collect_weather_data,"interval", minutes=1)
  scheduler.start()

  try:
    while True:
      time.sleep (1)
  except KeyboardInterrupt:
    print("\nStopping the weather scheduler...")
    scheduler.shutdown()

start_scheduler()