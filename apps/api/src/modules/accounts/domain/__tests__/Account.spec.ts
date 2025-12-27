import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { Account } from "../Account";
import { AccountType, AccountTypeValue } from "../vo/AccountType";
import { Slug } from "../vo/Slug";
import { ID, Status, StatusValue } from "@nubbix/domain";
import { ValidationError } from "@nubbix/domain";

describe("Account", () => {
  describe("constructor", () => {
    it("should create an account with default values", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();

      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(account.id).toBeInstanceOf(ID);
      expect(account.id.value).toBeDefined();
      expect(account.name).toBe(name);
      expect(account.slug).toBeInstanceOf(Slug);
      expect(account.slug.value).toBe(slug);
      expect(account.description).toBeNull();
      expect(account.website).toBeNull();
      expect(account.logo).toBeNull();
      expect(account.accountType).toBeInstanceOf(AccountType);
      expect(account.accountType.isTransactional()).toBe(true);
      expect(account.status.isActive()).toBe(true);
    });

    it("should create an account with all provided values", () => {
      const now = new Date();
      const id = ID.create(faker.string.uuid());
      const status = Status.active();
      const accountType = AccountType.recurring();
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const description = faker.company.catchPhrase();
      const website = faker.internet.url();
      const logo = faker.image.url();

      const account = new Account({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        status,
        name,
        slug,
        description,
        website,
        logo,
        accountType,
      });

      expect(account.id.value).toBe(id.value);
      expect(account.name).toBe(name);
      expect(account.slug.value).toBe(slug);
      expect(account.description).toBe(description);
      expect(account.website).toBe(website);
      expect(account.logo).toBe(logo);
      expect(account.accountType.isRecurring()).toBe(true);
    });

    it("should throw ValidationError for invalid slug", () => {
      expect(() => {
        new Account({
          name: faker.company.name(),
          slug: faker.lorem.sentence(), // Contains spaces
          description: null,
          website: null,
          logo: null,
          accountType: AccountType.transactional(),
        });
      }).toThrow(ValidationError);
    });
  });

  describe("getters", () => {
    it("should return correct name", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(account.name).toBe(name);
    });

    it("should return correct slug", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(account.slug).toBeInstanceOf(Slug);
      expect(account.slug.value).toBe(slug);
    });

    it("should return correct description", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const description = faker.company.catchPhrase();
      const account = new Account({
        name,
        slug,
        description,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(account.description).toBe(description);
    });

    it("should return correct website", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const website = faker.internet.url();
      const account = new Account({
        name,
        slug,
        description: null,
        website,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(account.website).toBe(website);
    });

    it("should return correct logo", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const logo = faker.image.url();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo,
        accountType: AccountType.transactional(),
      });

      expect(account.logo).toBe(logo);
    });

    it("should return correct accountType", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.recurring(),
      });

      expect(account.accountType.isRecurring()).toBe(true);
    });
  });

  describe("update", () => {
    it("should update account name", () => {
      const oldName = faker.company.name();
      const oldSlug = faker.helpers.slugify(oldName).toLowerCase();
      const newName = faker.company.name();
      const account = new Account({
        name: oldName,
        slug: oldSlug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      const initialUpdatedAt = account.updatedAt;
      Bun.sleepSync(10);

      account.update({ name: newName });

      expect(account.name).toBe(newName);
      expect(account.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });

    it("should update account description", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const oldDescription = faker.company.catchPhrase();
      const newDescription = faker.company.catchPhrase();
      const account = new Account({
        name,
        slug,
        description: oldDescription,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      account.update({ description: newDescription });

      expect(account.description).toBe(newDescription);
    });

    it("should update account website", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const oldWebsite = faker.internet.url();
      const newWebsite = faker.internet.url();
      const account = new Account({
        name,
        slug,
        description: null,
        website: oldWebsite,
        logo: null,
        accountType: AccountType.transactional(),
      });

      account.update({ website: newWebsite });

      expect(account.website).toBe(newWebsite);
    });

    it("should update account logo", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const oldLogo = faker.image.url();
      const newLogo = faker.image.url();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: oldLogo,
        accountType: AccountType.transactional(),
      });

      account.update({ logo: newLogo });

      expect(account.logo).toBe(newLogo);
    });

    it("should update multiple fields at once", () => {
      const oldName = faker.company.name();
      const oldSlug = faker.helpers.slugify(oldName).toLowerCase();
      const oldDescription = faker.company.catchPhrase();
      const oldWebsite = faker.internet.url();
      const oldLogo = faker.image.url();
      const newName = faker.company.name();
      const newDescription = faker.company.catchPhrase();
      const newWebsite = faker.internet.url();
      const newLogo = faker.image.url();

      const account = new Account({
        name: oldName,
        slug: oldSlug,
        description: oldDescription,
        website: oldWebsite,
        logo: oldLogo,
        accountType: AccountType.transactional(),
      });

      account.update({
        name: newName,
        description: newDescription,
        website: newWebsite,
        logo: newLogo,
      });

      expect(account.name).toBe(newName);
      expect(account.description).toBe(newDescription);
      expect(account.website).toBe(newWebsite);
      expect(account.logo).toBe(newLogo);
    });

    it("should not update fields that are not provided", () => {
      const originalName = faker.company.name();
      const originalSlug = faker.helpers.slugify(originalName).toLowerCase();
      const originalDescription = faker.company.catchPhrase();
      const newName = faker.company.name();
      const account = new Account({
        name: originalName,
        slug: originalSlug,
        description: originalDescription,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      account.update({ name: newName });

      expect(account.name).toBe(newName);
      expect(account.description).toBe(originalDescription);
    });

    it("should allow setting description to null", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const description = faker.company.catchPhrase();
      const account = new Account({
        name,
        slug,
        description,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      account.update({ description: null });

      expect(account.description).toBeNull();
    });
  });

  describe("validate", () => {
    it("should pass validation for valid account", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(() => account.validate()).not.toThrow();
    });

    it("should throw ValidationError when name is empty", () => {
      const slug = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const account = new Account({
        name: "",
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(() => account.validate()).toThrow(ValidationError);
      try {
        account.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details).toHaveLength(1);
        expect((error as ValidationError).details[0].path).toBe("name");
        expect((error as ValidationError).details[0].message).toBe("Name cannot be empty");
      }
    });

    it("should throw ValidationError when name is only whitespace", () => {
      const slug = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const account = new Account({
        name: "   ",
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(() => account.validate()).toThrow(ValidationError);
      try {
        account.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("name");
        expect((error as ValidationError).details[0].message).toBe("Name cannot be empty");
      }
    });

    it("should throw ValidationError when name exceeds 255 characters", () => {
      const slug = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const longName = "a".repeat(256);
      const account = new Account({
        name: longName,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(() => account.validate()).toThrow(ValidationError);
      try {
        account.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("name");
        expect((error as ValidationError).details[0].message).toBe(
          "Name cannot exceed 255 characters"
        );
      }
    });

    it("should accept name with exactly 255 characters", () => {
      const name = "a".repeat(255);
      const slug = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      expect(() => account.validate()).not.toThrow();
    });

    it("should throw ValidationError when accountType is missing", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      // Simulate missing accountType by setting it to undefined using reflection
      (account as any)._accountType = undefined;

      expect(() => account.validate()).toThrow(ValidationError);
      try {
        account.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("accountType");
        expect((error as ValidationError).details[0].message).toBe("AccountType is required");
      }
    });

    it("should pass validation with valid name and accountType", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const account = new Account({
        name,
        slug,
        description: faker.company.catchPhrase(),
        website: faker.internet.url(),
        logo: faker.image.url(),
        accountType: AccountType.recurring(),
      });

      expect(() => account.validate()).not.toThrow();
    });

    it("should throw multiple errors when both name and accountType are invalid", () => {
      const slug = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const account = new Account({
        name: "",
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      // Simulate missing accountType by setting it to undefined using reflection
      (account as any)._accountType = undefined;

      expect(() => account.validate()).toThrow(ValidationError);
      try {
        account.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details).toHaveLength(2);
        const paths = (error as ValidationError).details.map((d) => d.path);
        expect(paths).toContain("name");
        expect(paths).toContain("accountType");
      }
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation with all fields", () => {
      const now = new Date();
      const id = ID.create(faker.string.uuid());
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const description = faker.company.catchPhrase();
      const website = faker.internet.url();
      const logo = faker.image.url();
      const account = new Account({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        name,
        slug,
        description,
        website,
        logo,
        accountType: AccountType.transactional(),
      });

      const json = account.toJSON();

      expect(json).toEqual({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        status: StatusValue.ACTIVE,
        name,
        slug,
        description,
        website,
        logo,
        accountType: AccountTypeValue.TRANSACTIONAL,
      });
    });

    it("should return null values in JSON", () => {
      const name = faker.company.name();
      const slug = faker.helpers.slugify(name).toLowerCase();
      const account = new Account({
        name,
        slug,
        description: null,
        website: null,
        logo: null,
        accountType: AccountType.transactional(),
      });

      const json = account.toJSON();

      expect(json.description).toBeNull();
      expect(json.website).toBeNull();
      expect(json.logo).toBeNull();
    });
  });
});
