/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface IdentityInterface extends utils.Interface {
  functions: {
    "identify()": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "identify"): FunctionFragment;

  encodeFunctionData(functionFragment: "identify", values?: undefined): string;

  decodeFunctionResult(functionFragment: "identify", data: BytesLike): Result;

  events: {};
}

export interface Identity extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IdentityInterface;

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
    identify(overrides?: CallOverrides): Promise<[string]>;
  };

  identify(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    identify(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    identify(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    identify(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
