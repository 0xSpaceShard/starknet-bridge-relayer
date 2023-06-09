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

export interface StarknetGovernanceInterface extends utils.Interface {
  functions: {
    "starknetAcceptGovernance()": FunctionFragment;
    "starknetCancelNomination()": FunctionFragment;
    "starknetIsGovernor(address)": FunctionFragment;
    "starknetNominateNewGovernor(address)": FunctionFragment;
    "starknetRemoveGovernor(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "starknetAcceptGovernance"
      | "starknetCancelNomination"
      | "starknetIsGovernor"
      | "starknetNominateNewGovernor"
      | "starknetRemoveGovernor"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "starknetAcceptGovernance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "starknetCancelNomination",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "starknetIsGovernor",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "starknetNominateNewGovernor",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "starknetRemoveGovernor",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "starknetAcceptGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "starknetCancelNomination",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "starknetIsGovernor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "starknetNominateNewGovernor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "starknetRemoveGovernor",
    data: BytesLike
  ): Result;

  events: {
    "LogNewGovernorAccepted(address)": EventFragment;
    "LogNominatedGovernor(address)": EventFragment;
    "LogNominationCancelled()": EventFragment;
    "LogRemovedGovernor(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LogNewGovernorAccepted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogNominatedGovernor"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogNominationCancelled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogRemovedGovernor"): EventFragment;
}

export interface LogNewGovernorAcceptedEventObject {
  acceptedGovernor: string;
}
export type LogNewGovernorAcceptedEvent = TypedEvent<
  [string],
  LogNewGovernorAcceptedEventObject
>;

export type LogNewGovernorAcceptedEventFilter =
  TypedEventFilter<LogNewGovernorAcceptedEvent>;

export interface LogNominatedGovernorEventObject {
  nominatedGovernor: string;
}
export type LogNominatedGovernorEvent = TypedEvent<
  [string],
  LogNominatedGovernorEventObject
>;

export type LogNominatedGovernorEventFilter =
  TypedEventFilter<LogNominatedGovernorEvent>;

export interface LogNominationCancelledEventObject {}
export type LogNominationCancelledEvent = TypedEvent<
  [],
  LogNominationCancelledEventObject
>;

export type LogNominationCancelledEventFilter =
  TypedEventFilter<LogNominationCancelledEvent>;

export interface LogRemovedGovernorEventObject {
  removedGovernor: string;
}
export type LogRemovedGovernorEvent = TypedEvent<
  [string],
  LogRemovedGovernorEventObject
>;

export type LogRemovedGovernorEventFilter =
  TypedEventFilter<LogRemovedGovernorEvent>;

export interface StarknetGovernance extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StarknetGovernanceInterface;

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
    starknetAcceptGovernance(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    starknetCancelNomination(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    starknetIsGovernor(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    starknetNominateNewGovernor(
      newGovernor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    starknetRemoveGovernor(
      governorForRemoval: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  starknetAcceptGovernance(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  starknetCancelNomination(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  starknetIsGovernor(
    user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  starknetNominateNewGovernor(
    newGovernor: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  starknetRemoveGovernor(
    governorForRemoval: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    starknetAcceptGovernance(overrides?: CallOverrides): Promise<void>;

    starknetCancelNomination(overrides?: CallOverrides): Promise<void>;

    starknetIsGovernor(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    starknetNominateNewGovernor(
      newGovernor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    starknetRemoveGovernor(
      governorForRemoval: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "LogNewGovernorAccepted(address)"(
      acceptedGovernor?: null
    ): LogNewGovernorAcceptedEventFilter;
    LogNewGovernorAccepted(
      acceptedGovernor?: null
    ): LogNewGovernorAcceptedEventFilter;

    "LogNominatedGovernor(address)"(
      nominatedGovernor?: null
    ): LogNominatedGovernorEventFilter;
    LogNominatedGovernor(
      nominatedGovernor?: null
    ): LogNominatedGovernorEventFilter;

    "LogNominationCancelled()"(): LogNominationCancelledEventFilter;
    LogNominationCancelled(): LogNominationCancelledEventFilter;

    "LogRemovedGovernor(address)"(
      removedGovernor?: null
    ): LogRemovedGovernorEventFilter;
    LogRemovedGovernor(removedGovernor?: null): LogRemovedGovernorEventFilter;
  };

  estimateGas: {
    starknetAcceptGovernance(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    starknetCancelNomination(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    starknetIsGovernor(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    starknetNominateNewGovernor(
      newGovernor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    starknetRemoveGovernor(
      governorForRemoval: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    starknetAcceptGovernance(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    starknetCancelNomination(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    starknetIsGovernor(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    starknetNominateNewGovernor(
      newGovernor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    starknetRemoveGovernor(
      governorForRemoval: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
