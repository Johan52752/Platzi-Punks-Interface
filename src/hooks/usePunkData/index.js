import { useCallback, useEffect,useState } from "react";
import usePlatziPunks from "../usePlatziPunks/index"
import {useWeb3React} from "@web3-react/core"

const getPunkData = async ({ platziPunks, tokenId }) => {
  const [tokenURI, owner, tokenDNA] = await Promise.all([
    platziPunks?.methods.tokenURI(tokenId).call(),
    platziPunks?.methods.ownerOf(tokenId).call(),
    platziPunks?.methods.tokenDNA(tokenId).call(),
  ]);
  const propertys = await fetch(tokenURI);
  const jsonPropertys = await propertys.json();
  const [
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    platziPunks?.methods.getAccesoriesType(tokenDNA).call(),
    platziPunks?.methods.getClotheColor(tokenDNA).call(),
    platziPunks?.methods.getClotheType(tokenDNA).call(),
    platziPunks?.methods.getEyeType(tokenDNA).call(),
    platziPunks?.methods.getEyeBrowType(tokenDNA).call(),
    platziPunks?.methods.getFacialHairColor(tokenDNA).call(),
    platziPunks?.methods.getFacialHairType(tokenDNA).call(),
    platziPunks?.methods.getHairColor(tokenDNA).call(),
    platziPunks?.methods.getHatColor(tokenDNA).call(),
    platziPunks?.methods.getGraphicType(tokenDNA).call(),
    platziPunks?.methods.getMouthType(tokenDNA).call(),
    platziPunks?.methods.getSkinColor(tokenDNA).call(),
    platziPunks?.methods.getTopType(tokenDNA).call()
  ]);

  return {
    tokenId,
    tokenURI,
    owner,
    tokenDNA,
    ...jsonPropertys,
    attributes:{
        accessoriesType,
        clotheColor,
        clotheType,
        eyeType,
        eyeBrowType,
        facialHairColor,
        facialHairType,
        hairColor,
        hatColor,
        graphicType,
        mouthType,
        skinColor,
        topType,
    }
    };
};

//plural
const usePunksData=({owner=null}={})=>{
    const platziPunks=usePlatziPunks();
    const [punks,setPunks]=useState();
    const [loading,setLoading]=useState(false);
    const {library} = useWeb3React();
    
    const update=useCallback(async ()=>{
        if(platziPunks){
            setLoading(true);
            let punksId;
            if(!library.utils.isAddress(owner)){
                const totalSupply=await platziPunks?.methods.totalSupply().call();
                punksId=new Array(Number(totalSupply)).fill().map((_,index)=>index);
            }else{
                const balanceOf=await platziPunks?.methods.balanceOf(owner).call();
                const tokensIdsByOwner=new Array(Number(balanceOf)).fill().map((_,index)=>platziPunks?.methods.tokenOfOwnerByIndex(owner,index).call());
                punksId=await Promise.all(tokensIdsByOwner);
            }
            const punksData=punksId.map((tokenId)=>{
                return(getPunkData({platziPunks,tokenId}));
            })
            const punks=await Promise.all(punksData);
            setPunks(punks);
            setLoading(false)
        }
    },[platziPunks,owner,library?.utils])
    
    useEffect(()=>{
        update();
    },[update])

    return{
        punks,
        loading,
        update
    }

}

//singular
const usePunkData=(tokenId=null)=>{
    const platziPunks=usePlatziPunks();
    const [punk,setPunk]=useState();
    const [loading,setLoading]=useState(false);
    const update=useCallback(async ()=>{
       if(platziPunks&& tokenId!=null){
           setLoading(true);
           const toSet=await getPunkData({platziPunks,tokenId});
           setPunk(toSet);
           setLoading(false);
       }
    },[platziPunks,tokenId])
    useEffect(()=>{
        update();
    },[update])
    return{
        punk,
        loading,
        update
    }
}
export {usePunksData , usePunkData};
