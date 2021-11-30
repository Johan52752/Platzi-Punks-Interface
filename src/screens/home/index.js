import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import usePlatziPunks from "../../hooks/usePlatziPunks";
import { useCallback, useEffect, useState } from "react";
import useTruncatedAddress from "../../hooks/useTruncatedAddress"

export const Home = () => {
  const [imageSrc, setImageSrc] = useState("");
  const { active, account } = useWeb3React();
  const [avaliablePlatziPunks, setAvaliablePlatziPunks] = useState("...");
  const [isLoading, setIsLoading] = useState(false);
  const [totalSupply, setTotalSupply]=useState();
  const toast = useToast();
  const platziPunks = usePlatziPunks();
  const truncatedAddress=useTruncatedAddress(account);

  const getPlatziPunk = useCallback(async () => {
    if (platziPunks) {
      const totalSupply = await platziPunks?.methods.totalSupply().call();
      const dna = await platziPunks?.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      const img = await platziPunks?.methods.imageByDNA(dna).call();
      setImageSrc(img);
    }
  }, [platziPunks, account]);
  const getAvaliablePlatiPunks = useCallback(async () => {
    if (platziPunks) {
      const totalSupply = await platziPunks?.methods.totalSupply().call();
      setTotalSupply(totalSupply);
      const maxSupply = await platziPunks?.methods.maxSupply().call();
      setAvaliablePlatziPunks(maxSupply - totalSupply);
    }
  }, [platziPunks]);

  const mint = async () => {
    setIsLoading(true);
    platziPunks?.methods
      .mint()
      .send({ from: account })
      .on("transactionHash", (txHash) => {
        toast({
          title: "Transaccion enviada",
          description: txHash,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      })
      .on("receipt", () => {
        toast({
          title: "Transaccion confirmada",
          description: "Nunca pares de aprender",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      })
      .on("error", (error) => {
        toast({
          title: "Transaccion fallida",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getPlatziPunk();
  }, [getPlatziPunk]);
  useEffect(() => {
    getAvaliablePlatiPunks();
  }, [getAvaliablePlatiPunks]);

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "green.400",
              zIndex: -1,
            }}
          >
            Un Platzi Punk
          </Text>
          <br />
          <Text as={"span"} color={"green.400"}>
            nunca para de aprender
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Platzi Punks es una colección de Avatares randomizados cuya metadata
          es almacenada on-chain. Poseen características únicas y sólo hay 10000
          en existencia.
        </Text>
        <Text color={"green.500"}>
          Cada Platzi Punk se genera de forma secuencial basado en tu address,
          usa el previsualizador para averiguar cuál sería tu Platzi Punk si
          minteas en este momento
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
            disabled={!platziPunks}
            onClick={mint}
            isLoading={isLoading}
          >
            Obtén tu punk
          </Button>
          <Link to="/punks">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galería
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={active ? imageSrc : "https://avataaars.io/"} />
        {active ? (
          <>
            <Flex mt={3}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  {totalSupply}
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  {truncatedAddress}
                </Badge>
              </Badge>
              <Badge ml={3}>
                avaliablePlatziPunks
                <Badge ml={1} colorScheme="green">
                  {avaliablePlatziPunks}
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getPlatziPunk}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};
