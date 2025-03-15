export default class APIService {


    // Test Data
    static Tester(body) {
        return fetch(`http://localhost:5000/tester`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .catch(error => console.log(error))
    }

    // Can add other methods below

}