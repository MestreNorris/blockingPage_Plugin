/**
 * Cria array de links blacklist para bloquear.
 * @returns - Array de string contendo links para bloquear, únicos e ordenados ASC.
 */
const updateList = async () => {
    let result = [];
    const dataBlacklist = await blacklist.getAll().then(res => { return res });

    await whitelist.getAll().then(dataWhitelist => {
        if (dataBlacklist.length != 0) {

            for (let index = 0; index < dataBlacklist.length; index++) {
                let blackIsWhite = false;
                if (dataWhitelist.length == 0) {
                    if (dataBlacklist[index].statusLink == true) {
                        const linkBlacklist = dataBlacklist[index].link + "/*";
                        result.push(linkBlacklist);
                    }
                } else {
                    const link1 = dataBlacklist[index].link;

                    for (let j = 0; j < dataWhitelist.length; j++) {
                        const link2 = dataWhitelist[j].link;
                        if ((link1 === link2) && (dataWhitelist[j].statusLink)) { blackIsWhite = true; }
                    }

                    if (!blackIsWhite) {
                        if (dataBlacklist[index].statusLink == true) {
                            const linkBlacklist1 = dataBlacklist[index].link + "/*";
                            result.push(linkBlacklist1);
                        }
                    }
                }
            }
            result = removeDuplicatesList(result);
            result = sortList(result);
        }
    });
    return result;
}