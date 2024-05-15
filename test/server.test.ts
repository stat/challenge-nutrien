import request from "supertest";

import {app} from "../src/server";

describe("Server", () => {
  test("/:commodity/histogram", async () => {
    const res = await request(app).get("/commodity/histogram");
    expect(res.body).toEqual("");
  });
});
