import subprocess
import sys
import os
import signal


def run_script_as_subprocess(script_name="AgentStarter.py", args=["console"]):
    cmd = [sys.executable, script_name] + args

    if os.name == "nt":
        proc = subprocess.Popen(
            cmd,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    else:
        proc = subprocess.Popen(
            cmd,
            preexec_fn=os.setsid,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    return proc



def ctrl_c_subprocess(proc):
    import time
    if proc.poll() is not None:
        return
    try:
        if os.name == 'nt':
            proc.send_signal(signal.CTRL_BREAK_EVENT)
        else:
            os.killpg(os.getpgid(proc.pid), signal.SIGINT)
        time.sleep(2)
        if proc.poll() is None:
            proc.terminate()
    except Exception as e:
        print(f"Failed to stop subprocess: {e}")