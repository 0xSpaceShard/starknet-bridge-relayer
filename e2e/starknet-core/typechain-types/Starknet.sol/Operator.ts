/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface OperatorInterface extends utils.Interface {
  functions: {
    "isOperator(address)": FunctionFragment;
    "registerOperator(address)": FunctionFragment;
    "unregisterOperator(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "isOperator"
      | "registerOperator"
      | "unregisterOperator"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "isOperator",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerOperator",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "unregisterOperator",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "isOperator", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registerOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unregisterOperator",
    data: BytesLike
  ): Result;

  events: {
    "LogOperatorAdded(address)": EventFragment;
    "LogOperatorRemoved(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LogOperatorAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogOperatorRemoved"): EventFragment;
}

export interface LogOperatorAddedEventObject {
  operator: string;
}
export type LogOperatorAddedEvent = TypedEvent<
  [string],
  LogOperatorAddedEventObject
>;

export type LogOperatorAddedEventFilter =
  TypedEventFilter<LogOperatorAddedEvent>;

export interface LogOperatorRemovedEventObject {
  operator: string;
}
export type LogOperatorRemovedEvent = TypedEvent<
  [string],
  LogOperatorRemovedEventObject
>;

export type LogOperatorRemovedEventFilter =
  TypedEventFilter<LogOperatorRemovedEvent>;

export interface Operator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OperatorInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    isOperator(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    registerOperator(
      newOperator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unregisterOperator(
      removedOperator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  isOperator(
    user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  registerOperator(
    newOperator: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unregisterOperator(
    removedOperator: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    isOperator(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    registerOperator(
      newOperator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    unregisterOperator(
      removedOperator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "LogOperatorAdded(address)"(operator?: null): LogOperatorAddedEventFilter;
    LogOperatorAdded(operator?: null): LogOperatorAddedEventFilter;

    "LogOperatorRemoved(address)"(
      operator?: null
    ): LogOperatorRemovedEventFilter;
    LogOperatorRemoved(operator?: null): LogOperatorRemovedEventFilter;
  };

  estimateGas: {
    isOperator(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerOperator(
      newOperator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unregisterOperator(
      removedOperator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isOperator(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerOperator(
      newOperator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unregisterOperator(
      removedOperator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}