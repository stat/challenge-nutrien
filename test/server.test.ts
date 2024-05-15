import request from "supertest";

import {app} from "../src/server";

describe("Server", () => {
  test("/Commodity/histogram", async () => {
    const res = await request(app).get("/Commodity/histogram");
    expect(res.body).toEqual("");
  });

  test("/CommodityType/histogram", async () => {
    const res = await request(app).get("/CommodityType/histogram");
    expect(res.body).toEqual("");
  });
});
