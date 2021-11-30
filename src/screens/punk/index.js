import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import PunkCard from "../../components/punk-card";
import { usePunkData } from "../../hooks/usePunkData/index";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useState } from "react";
import usePlatziPunks from "../../hooks/usePlatziPunks";

const Punk = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const toast = useToast();
  const { punk, loading, update } = usePunkData(tokenId);
  const [transfering, setTransfering] = useState(false);
  const platziPunks = usePlatziPunks();

  const transfer = () => {
    setTransfering(true);
    const address = prompt("Ingresa la dirección: ");
    const isAddress = library.utils.isAddress(address);
    if (isAddress) {
    console.log(platziPunks)
      platziPunks?.methods
        .safeTransferFrom(punk.owner, address, punk.tokenId)
        .send({ from: account, })
        .on("error", (error) => {
          setTransfering(false);
          toast({
            title: "Transaccion fallida",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        })
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
          setTransfering(false);
          toast({
            title: "Transaccion recibida",
            description: `El punk ahora le pertenece a ${address}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          update();
        });
    } else {
      setTransfering(false);
      toast({
        title: "Direccion invalida",
        description: `La direccion ${address} no es una direccion valida`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Loading />;
  if (!active) return <RequestAccess />;
  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={punk?.name}
          image={punk?.image}
        />
        <Button
          colorScheme="green"
          disabled={account !== punk?.owner}
          onClick={transfer}
          isLoading={transfering}
        >
          {account !== punk?.owner
            ? "No eres el dueño para transferir"
            : "Transferir"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{}</Heading>
        <Text fontSize="xl">{}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {punk?.tokenDNA}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {punk?.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {punk
              ? Object.entries(punk.attributes).map(([key, value]) => (
                  <Tr key={key}>
                    <Td>{key}</Td>
                    <Td>
                      <Tag>{value}</Tag>
                    </Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Punk;
