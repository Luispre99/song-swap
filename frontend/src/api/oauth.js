import axios from "axios";

export const oauth = async () => {
  const response = await axios.get('http://localhost:8000/oauth')
  const { status, data } = response.data;
  if (status == 'success'){
    if (data.oauth_url){
      let oauthWindow = window.open(data.oauth_url)
      return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
            try {
                const statusResponse = await axios.get('http://localhost:8000/oauth-status');
                const { status: oauthStatus } = statusResponse.data;

                if (oauthStatus !== 'logging') {
                    oauthWindow.close();
                    clearInterval(intervalId);

                    if (oauthStatus === 'logged') {
                        resolve('logged');
                    } else {
                        resolve('error');
                    }
                }
            } catch (error) {
                console.log(error)
                clearInterval(intervalId);
                oauthWindow.close();
                reject('error');
            }
        }, 2000);
    });
    }
    else{
      return 'logged'
    }
  }
  return 'error'
}
