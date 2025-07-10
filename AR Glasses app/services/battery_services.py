import psutil
class Battery():
    def __init__(self):
        self.percent=0
        self.status="Unknown"

    def get_battery_info(self,update_battery_status):
        battery = psutil.sensors_battery()
        if battery is not None:
           self.percent = battery.percent
           self.plugged = battery.power_plugged
           self.status = "Charging" if self.plugged else "Not Charging"
           update_battery_status(f"{self.percent}% | Status: {self.status}")
            
        else:
            update_battery_status("None")
