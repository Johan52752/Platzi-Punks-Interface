import {
  Flex,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injected } from "../../../config/web3/index";
import { useEffect, useState, useMemo, useCallback } from "react";
import { computeHeadingLevel } from "@testing-library/react";

const WalletData = () => {
  const [balance, setBalance] = useState(0);
  const { active, activate, account, library, error, deactivate, chainId } =
    useWeb3React();
  const isUnsuportedChain = error instanceof UnsupportedChainIdError;

  const connect = useCallback(() => {
    // console.log("Connect render");
    activate(injected);
    localStorage.setItem("previouslyConnect", "true");
  }, [activate]);
  
  const shortAddress = useMemo(() => {
    // console.log("shortAddress render");
    const newAddress =
      account?.substring(0, 5) +
      "..." +
      account?.substring(account?.length - 4, account?.length);
    return newAddress;
  }, [account]);
  
  const disconnect = () => {
    // console.log("Disconnect render");
    deactivate();
    localStorage.setItem("previouslyConnect", "false");
  };

  const getBalance = useCallback(async () => {
    const toSet = await library.eth.getBalance(account);
    setBalance(toSet / 1e18);
  }, [account, library?.eth]);

  useEffect(async () => {
    if (active) {
      await getBalance();
    }
  }, [active, getBalance]);

  useEffect(() => {
    if (localStorage.getItem("previouslyConnect") === "true") {
      connect();
    }
  }, [connect]);

  return (
    <Flex alignItems={"center"}>
      {active ? (
        <Tag colorScheme="green" borderRadius="full">
          <TagLabel>
            <Link to={`/punks?address=${account}`}>{shortAddress}</Link>
          </TagLabel>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
            ~{balance} Ξ
          </Badge>
          <TagCloseButton onClick={disconnect} />
        </Tag>
      ) : (
        <Button
          variant={"solid"}
          colorScheme={"green"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsuportedChain}
        >
          {isUnsuportedChain ? "Red no soportada" : "Conectar wallet"}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;
