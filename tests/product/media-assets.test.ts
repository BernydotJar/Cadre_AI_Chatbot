import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { cadreDonna } from "@/product/profiles/cadre-donna";

const reviewed = {
  video: {
    path: "public/media/donna-ambient-loop.mp4",
    sha256: "43332f21ca8b4443c4d362b596f0d4f75ad69f09c88c75ef9354f735f6e532d8",
    bytes: 105727,
  },
  poster: {
    path: "public/media/donna-ambient-poster.webp",
    sha256: "d1dccb94e2e5a4048ebdcb8965ff0cfea9fbb362dd291be94e07eb9b9bb2c8ee",
    bytes: 3630,
  },
} as const;

function sha256(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("reviewed ambient media bytes", () => {
  it("pins the exact video bytes whose ffprobe evidence proves 8s and no audio", () => {
    expect(cadreDonna.experience.ambientMedia).toMatchObject({
      videoSrc: "/media/donna-ambient-loop.mp4",
      durationSeconds: 8,
    });
    expect(statSync(reviewed.video.path).size).toBe(reviewed.video.bytes);
    expect(statSync(reviewed.video.path).size).toBeLessThanOrEqual(250_000);
    expect(sha256(reviewed.video.path)).toBe(reviewed.video.sha256);
  });

  it("pins the poster paired with the reviewed loop", () => {
    expect(cadreDonna.experience.ambientMedia?.posterSrc).toBe("/media/donna-ambient-poster.webp");
    expect(statSync(reviewed.poster.path).size).toBe(reviewed.poster.bytes);
    expect(statSync(reviewed.poster.path).size).toBeLessThanOrEqual(20_000);
    expect(sha256(reviewed.poster.path)).toBe(reviewed.poster.sha256);
  });
});
