#!/usr/bin/env python3

import csv
import json
import argparse


def get_args():
    parser = argparse.ArgumentParser(description='Convert localisation to json')
    parser.add_argument('input', type=argparse.FileType("r"),
                        help='input csv')
    parser.add_argument('output', type=argparse.FileType("w"),
                        help='output .js file')

    args = parser.parse_args()
    return args

def main(inpt, output):

    data = {}
    reader = csv.reader(inpt)
    next(reader, None) # skip head
    for row in reader:
        key, cs, en, sk = row
        data[key] = {"cs": cs, "en": en, "sk": sk}

    output.write("export default\n\n")
    output.write(json.dumps(data))


if __name__ == "__main__":
    args = get_args()

    main(args.input, args.output)
