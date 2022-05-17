import React, {useState, useEffect} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import styles from './Live.module.scss';

interface ILivePrice {
    [key:string]:string;
}

const Live = () => {    
    const SOCKET_URL = 'wss://ws.coincap.io/prices';
    const [socketUrl, setSocketUrl] = useState(SOCKET_URL);    
    const [queriedCrypto, setQueriedCrypto] = useState<string>("");
    const [webSocketQueryParamsAsset, setWebSocketQueryParamsAsset] = useState<string[]>([])
    const [livePrice, setLivePrice] = useState<ILivePrice>({});

    
    const {lastMessage, readyState } = useWebSocket(socketUrl);
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];
    
  /*
  * Check duplicate crypto name
  * Keep track of existing crypto names
  * Update WebSocket URL
  */
  const handleAddCrypto = () => {            
      if(queriedCrypto.length) {
        const assets = webSocketQueryParamsAsset;
        if(assets.indexOf(queriedCrypto) === -1) {
            assets.push(queriedCrypto);
            setWebSocketQueryParamsAsset(assets);
            setSocketUrl(`${SOCKET_URL}?assets=${assets.join(',')}`);
        }
        
      }
  }

  /*
  * @params: crypto: string - name of the crypto to be removed
  * Remove the crypto from the tracked crypto list
  * Update Websocket assets to fetch data
  */
  const removeCrypto = (crypto: string) => {
      if(crypto.length) {
        const assets = webSocketQueryParamsAsset;
        const cryptoIndex = assets.indexOf(crypto);
        if(cryptoIndex > -1) {
            assets.splice(cryptoIndex, 1);
            delete livePrice[crypto];
            setWebSocketQueryParamsAsset(assets);
            setSocketUrl(`${SOCKET_URL}?assets=${assets.join(',')}`);
        }
      }
  }

  useEffect(() => {
    if (lastMessage !== null) {             
        if(lastMessage.data.length) {
            const parsedData = JSON.parse(lastMessage.data);
            
            let livePriceFromWebSocket:ILivePrice = livePrice;
            Object.keys(parsedData).forEach(item =>livePriceFromWebSocket[item.toString()] = String(parsedData[item]));
                
            setLivePrice( livePriceFromWebSocket)
        }                          
    }
  }, [lastMessage, livePrice]);
  
    return (
        <div className={styles.liveContainer}>
            <div className={styles.liveContainerSearch}>                
                <input 
                    name="search-crypto" 
                    onChange={(event) => setQueriedCrypto(event.target.value)} 
                    placeholder="Live Crypto"                    
                />                
                <button data-test="add-button" onClick={handleAddCrypto}>+Add</button>
            </div>
            <p data-test="websocket" className={styles.liveContainerWebSocket}>WebSocket Status:{connectionStatus}</p>
            <ul data-test="crypto-list" className={styles.liveContainerList}>                
            {Object.keys(livePrice).map((item) => (
                    <li key={item}>                        
                        <span>{item}</span>
                        <span>{livePrice[item]}</span>
                        <button onClick={() => {                            
                            if( window.confirm(`Want to remove ${item}?`)){
                                removeCrypto(item)
                            }}}
                        >
                            Remove
                        </button>
                    </li>)
                )}            
            </ul>
            
        </div>
    )
}

export default Live;