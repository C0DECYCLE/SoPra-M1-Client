/**
 * Copyright (C) - All Rights Reserved
 * Written by Noah Mattia Bussinger, September 2020
 */

export const PHI = (1 + 5 ** 0.5) / 2;

export const toAngle = 180 / Math.PI;
export const toRadian = Math.PI / 180;

export function normalizeRadian(value) {
  value = value % (2 * Math.PI);
  if (value < 0) {
    value += 2 * Math.PI;
  }
  return value;
}

export function UUIDv4() {
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export function between(value, lower, upper) {
  return value > Math.min(lower, upper) && value < Math.max(lower, upper);
}

export function dotit(value) {
  value = typeof value === "string" ? value : value.toFixed(0);
  return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1'");
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function firstLetterUppercase(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function replaceAt(value, index, replacement) {
  return `${value.substring(0, index)}${replacement}${value.substring(
    index + replacement.length
  )}`;
}

/*
export function hexToRgb(value) {
    return new Vec3(
        (value & 0xff0000) >> 16,
        (value & 0x00ff00) >> 8,
        value & 0x0000ff,
    ).divide(256);
}
*/

export function toHexadecimal(value) {
  return Number(`0x${value.split("#")[1]}`);
}

export function count(value, target) {
  return value.filter((x) => x === target).length;
}

export function swapRemove(value, at) {
  value[at] = value[value.length - 1];
  value.pop();
  return value;
}

export function clear(value) {
  value.length = 0;
  return value;
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

export async function fileExists(path) {
  return await fetch(path, { method: "HEAD" }).then(
    async (response) => response.ok
  );
}

export async function fileLoad(path) {
  return await fetch(path).then(async (response) => await response.text());
}

export function msToFps(ms) {
  return dotit(1_000 / ms);
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getSafeArea(key) {
  return parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue(key)
      .split("px")[0]
  );
}

export function romanize(value) {
  const digits = String(+value).split("");
  // prettier-ignore
  const key = [
        "", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"
    ];
  let roman = "";
  let i = 3;
  while (i--) {
    // @ts-ignore
    roman = (key[+digits.pop() + i * 10] || "") + roman;
  }
  return Array(+digits.join("") + 1).join("M") + roman;
}

export function deepImmutable(root) {
  for (const key of Object.keys(root)) {
    const value = root[key];
    if (typeof value === "object") {
      deepImmutable(value);
    }
  }
  return Object.freeze(root);
}
