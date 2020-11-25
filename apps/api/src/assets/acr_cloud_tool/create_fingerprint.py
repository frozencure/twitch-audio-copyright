from acrcloud_extr_tool import get_duration_ms_by_file, create_fingerprint_by_file
import sys
from math import floor
import time

def create_fingerprint(inputFile):
    # acrcloud_extr_tool.set_debug()
    min_duration = 5
    audio_fingerprint_opt = {
        'filter_energy_min': 100,
        'silence_energy_threshold': 1200,
        'silence_rate_threshold': 0.7
    }
    durationInMs = get_duration_ms_by_file(inputFile)
    duration = floor(durationInMs/1000)
    print(duration)
    if duration >= min_duration:
      result = create_fingerprint_by_file(inputFile, 0, duration, False, audio_fingerprint_opt)
      if result is not None:
        [print(b) for b in result]

create_fingerprint(sys.argv[1])
