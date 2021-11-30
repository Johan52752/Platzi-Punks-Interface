import { useWeb3React } from "@web3-react/core";
import { SearchIcon } from "@chakra-ui/icons";
import Loading from "../../components/loading/index";
import PunkCard from "../../components/punk-card/index";
import RequestAccess from "../../components/request-access/index";
import { useState } from "react";
import { usePunksData } from "../../hooks/usePunkData";
import {
  Grid,
  FormControl,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Button,
  FormHelperText,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { set } from "lodash";
import { useNavigate, useLocation } from "react-router-dom";

const Punks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { active, account, library } = useWeb3React();
  const [validAddress, setValidAddress] = useState(true);
  const [address, setAddress] = useState(
    new URLSearchParams(location.search).get("address")
  );
  const [submitted, setSubmitted] = useState(true);
  const { punks, loading } = usePunksData({
    owner: validAddress && submitted ? address : null,
  });
  const handlerAddress = (e) => {
    setAddress(e.target.value);
    setValidAddress(false);
    setSubmitted(false);
  };
  const submit = (e) => {
    e.preventDefault();
    if (address) {
      const isValid = library.utils.isAddress(address);
      setValidAddress(isValid);
      setSubmitted(true);
      if (isValid) {
        navigate(`/punks?address=${address}`);
      }
    } else {
      navigate("/punks");
    }
  };
  if (!active) return <RequestAccess />;
  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por direccion"
              isInvalid={false}
              onChange={handlerAddress}
              value={address}
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {!validAddress && submitted ? (
            <FormHelperText>Direccion invalida</FormHelperText>
          ) : null}
        </FormControl>
      </form>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {punks?.length > 0 ? (
            punks
              .sort(function (a, b) {
                if (a.tokenId > b.tokenId) {
                  return 1;
                }
                if (a.name < b.name) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              })
              .map((punk) => (
                <Link key={punk.tokenId} to={`/punk/${punk.tokenId}`}>
                  <PunkCard image={punk.image} name={punk.name} />
                </Link>
              ))
          ) : (
            <h1>No hay punks</h1>
          )}
        </Grid>
      )}
    </>
  );
};
export default Punks;
