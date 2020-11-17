import acrcloud_extr_tool
import sys


def create_fingerprint(inputFile, start, length):
    # acrcloud_extr_tool.set_debug()
    audio_fingerprint_opt = {
        'filter_energy_min': 100,
        'silence_energy_threshold': 1200,
        'silence_rate_threshold': 0.7
    }
    result = acrcloud_extr_tool.create_fingerprint_by_file(inputFile, start, length, False, audio_fingerprint_opt)
    [print(b) for b in result]


create_fingerprint(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]))
