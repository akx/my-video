import argparse
import re, json

import sys

K_RE = re.compile(r'(\{\\k([0-9]+)\})')


def parse_time(dt):
    h, m, s, hs = [float(int(p, 10)) for p in re.split('[:.,]', dt)]
    return h * 60 * 60 + m * 60 + s * 1 + hs / 100.0


def parse_ass(infp):
    for line in infp:
        if not line.startswith('Dialogue:'):
            continue
        line = line.split(',', 9)
        start = parse_time(line[1])
        end = parse_time(line[2])
        parts = K_RE.split(line[-1])[1:]
        word_durations = zip([int(s, 10) / 100.0 for s in parts[1::3]], [s.strip() for s in parts[2::3]])
        for i, (dur, word) in enumerate(word_durations):
            d = {
                'time': round(start, 3),
                'word': word,
            }
            if i == 0:
                d['verse'] = True
            yield d
            start += dur


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('file', type=argparse.FileType())
    ap.add_argument('-o', '--output', type=argparse.FileType('w'), default=None)
    ap.add_argument('--indent', default=None, type=int)
    args = ap.parse_args()

    json.dump(
        list(parse_ass(args.file)),
        (args.output or sys.stdout),
        indent=args.indent,
    )


if __name__ == '__main__':
    main()
