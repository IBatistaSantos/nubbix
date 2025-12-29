import { describe, it, expect } from "bun:test";
import { TicketSales, TicketSalesStatusValue } from "../vo/TicketSales";

describe("TicketSales", () => {
  describe("static methods", () => {
    it("should create disabled ticket sales", () => {
      const ticketSales = TicketSales.disabled();
      expect(ticketSales.enabled).toBe(false);
      expect(ticketSales.status).toBe(TicketSalesStatusValue.CLOSED);
      expect(ticketSales.isClosed()).toBe(true);
      expect(ticketSales.isOpen()).toBe(false);
    });

    it("should create enabled ticket sales with open status", () => {
      const ticketSales = TicketSales.enabled(TicketSalesStatusValue.OPEN);
      expect(ticketSales.enabled).toBe(true);
      expect(ticketSales.status).toBe(TicketSalesStatusValue.OPEN);
      expect(ticketSales.isOpen()).toBe(true);
      expect(ticketSales.isClosed()).toBe(false);
    });

    it("should create enabled ticket sales with closed status", () => {
      const ticketSales = TicketSales.enabled(TicketSalesStatusValue.CLOSED);
      expect(ticketSales.enabled).toBe(true);
      expect(ticketSales.status).toBe(TicketSalesStatusValue.CLOSED);
      expect(ticketSales.isOpen()).toBe(false);
      expect(ticketSales.isClosed()).toBe(true);
    });

    it("should create from props", () => {
      const ticketSales = TicketSales.create({
        enabled: true,
        status: TicketSalesStatusValue.OPEN,
      });
      expect(ticketSales.enabled).toBe(true);
      expect(ticketSales.status).toBe(TicketSalesStatusValue.OPEN);
    });
  });

  describe("toJSON", () => {
    it("should return JSON representation", () => {
      const ticketSales = TicketSales.enabled();
      const json = ticketSales.toJSON();
      expect(json).toEqual({
        enabled: true,
        status: TicketSalesStatusValue.OPEN,
      });
    });
  });
});
