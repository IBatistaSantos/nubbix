import { BaseEntity, BaseProps, ValidationError } from "@nubbix/domain";
import { faker } from "@faker-js/faker";
import { AccountType } from "./vo/AccountType";
import { Slug } from "./vo/Slug";

interface AccountProps extends BaseProps {
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo: string | null;
  accountType: AccountType;
}

interface AccountUpdateData {
  name: string;
  description: string | null;
  website: string | null;
  logo: string | null;
}

export class Account extends BaseEntity {
  private _name: string;
  private _slug: Slug;
  private _description: string | null;
  private _website: string | null;
  private _logo: string | null;
  private _accountType: AccountType;

  constructor(props: AccountProps) {
    super(props);
    this._name = props.name;
    this._slug = Slug.create(props.slug);
    this._description = props.description ?? null;
    this._website = props.website ?? null;
    this._logo = props.logo ?? null;
    this._accountType = props.accountType;
  }

  get name() {
    return this._name;
  }

  get slug() {
    return this._slug;
  }

  get description() {
    return this._description;
  }

  get website() {
    return this._website;
  }

  get logo() {
    return this._logo;
  }

  get accountType() {
    return this._accountType;
  }

  validate(): void {
    const errors: Array<{ path: string; message: string }> = [];

    // Validate name
    if (!this._name || this._name.trim().length === 0) {
      errors.push({
        path: "name",
        message: "Name cannot be empty",
      });
    }

    if (this._name && this._name.length > 255) {
      errors.push({
        path: "name",
        message: "Name cannot exceed 255 characters",
      });
    }

    // Validate accountType
    if (!this._accountType) {
      errors.push({
        path: "accountType",
        message: "AccountType is required",
      });
    }

    if (errors.length > 0) {
      throw new ValidationError("Account validation failed", errors);
    }
  }

  update(props: Partial<AccountUpdateData>) {
    if (props.name !== undefined) this._name = props.name;
    if (props.description !== undefined) this._description = props.description;
    if (props.website !== undefined) this._website = props.website;
    if (props.logo !== undefined) this._logo = props.logo;
    this._updatedAt = new Date();
  }

  static asFaker(overrides?: Partial<AccountProps>): Account {
    const baseProps = this.generateBaseFakerProps();
    const companyName = faker.company.name();

    return new Account({
      ...baseProps,
      name: companyName,
      slug: faker.helpers.slugify(companyName).toLowerCase(),
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      logo: faker.image.url(),
      accountType: AccountType.transactional(),
      ...overrides,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this._name,
      slug: this._slug.value,
      description: this._description,
      website: this._website,
      logo: this._logo,
      accountType: this._accountType.value,
    };
  }
}
