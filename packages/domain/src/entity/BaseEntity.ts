import { ID } from "../vo/ID";
import { Status } from "../vo/Status";
import { v7 as uuidv7 } from "uuid";

export interface BaseProps extends Partial<{
  id: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  status: Status;
}> {}

export abstract class BaseEntity {
  private readonly _id: ID;
  private _deletedAt: Date | null;
  private readonly _createdAt: Date;
  protected _updatedAt: Date;
  private _status: Status;

  constructor(props: BaseProps) {
    this._id = ID.create(props.id);
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._deletedAt = props.deletedAt ?? null;
    this._status = props.status ?? Status.active();
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  get status() {
    return this._status;
  }

  deactivate() {
    this._status = Status.inactive();
    this._updatedAt = new Date();
    this._deletedAt = new Date();
  }

  activate() {
    this._status = Status.active();
    this._updatedAt = new Date();
    this._deletedAt = null;
  }

  toJSON() {
    return {
      id: this._id.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      status: this._status.value,
    };
  }

  static asFaker(overrides?: Partial<any>): BaseEntity {
    throw new Error(`asFaker must be implemented by ${this.name}`);
  }

  protected static generateBaseFakerProps(): BaseProps {
    const now = new Date();
    return {
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      status: Status.active(),
    };
  }
}

