import { ValidationError } from "@nubbix/domain";

export interface AddressProps {
  street: string;
  city: string;
  state: string;
  zip?: string | null;
  country: string;
}

export class Address {
  private _street: string;
  private _city: string;
  private _state: string;
  private _zip: string | null;
  private _country: string;

  private constructor(props: AddressProps) {
    this._street = props.street;
    this._city = props.city;
    this._state = props.state;
    this._zip = props.zip ?? null;
    this._country = props.country;
  }

  static create(props: AddressProps): Address {
    const errors: Array<{ path: string; message: string }> = [];

    if (!props.street || props.street.trim().length === 0) {
      errors.push({
        path: "address.street",
        message: "Street is required",
      });
    }

    if (!props.city || props.city.trim().length === 0) {
      errors.push({
        path: "address.city",
        message: "City is required",
      });
    }

    if (!props.state || props.state.trim().length === 0) {
      errors.push({
        path: "address.state",
        message: "State is required",
      });
    }

    if (!props.country || props.country.trim().length === 0) {
      errors.push({
        path: "address.country",
        message: "Country is required",
      });
    }

    if (errors.length > 0) {
      throw new ValidationError("Address validation failed", errors);
    }

    return new Address(props);
  }

  get street() {
    return this._street;
  }

  get city() {
    return this._city;
  }

  get state() {
    return this._state;
  }

  get zip() {
    return this._zip;
  }

  get country() {
    return this._country;
  }

  toJSON() {
    return {
      street: this._street,
      city: this._city,
      state: this._state,
      zip: this._zip,
      country: this._country,
    };
  }
}
