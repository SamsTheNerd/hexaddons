var fetchFullModData = (modid) => {
    return fetch(`https://api.modrinth.com/v2/project/${modid}`)
    .then((response) => response.json());
}

const modrinthRE = new RegExp(".*modrinth\.com\/(?:(?:mod)|(?:resourcepack)|(?:modpack))\/([0-9a-zA-Z\-]+).*");
var slugsToNames = {};

var idFromUrl = (url) => {
    // console.log(url);
    return url.match(modrinthRE)[1];
}

/**
 * Gets the team slug for a given project.
 * @param {*} project
 * @returns {Promise<string>}
 */
async function getTeam(project) {
  if (project.organization !== null) {
    const team = await (await fetch(`https://api.modrinth.com/v3/organization/${project.organization}`)).json();
    return team["team_id"]
  } else {
    return project["team"];
  }
}

/**
 * takes an array of addons, returns a promise with a map of addon ids -> modrinth data
 * @params {Array<Record<string, any>>} addons
 * @returns {Promise<{[key: string]: any}>}
 */
async function getModDataMulti(addons) {
  const addonSlugs = addons.map(addon => {
    if (addon.modrinth_url == null) return;
    const slug = idFromUrl(addon.modrinth_url);
    slugsToNames[slug] = addon.name;
    return slug;
  });

  const addonSlugsForSearch = addonSlugs.filter(s => s != null).map(s => `"${s}"`).join(",");

  const projects = await (await fetch(`https://api.modrinth.com/v2/projects?ids=[${addonSlugsForSearch}]`)).json();

  const dataRecord = {};
  for (const project of projects) {
    dataRecord[slugsToNames[project.slug]] = {
      team_id: await getTeam(project),
      icon_url: project["icon_url"],
      platforms: project["loaders"],
      source_url: project["source_url"],
      book_url: project["wiki_url"],
      downloads: project["downloads"],
      game_versions: project["game_versions"],
      published_date: Date.parse(project["approved"] || project["published"]),
      updated_date: Date.parse(project["updated"]),
      description: project["description"]
    };
  }

  return dataRecord;
}

var getTeamDataMulti =(teamIds) => {
    var teamIdsStr = teamIds.map(s => `"${s}"`).join(",");
    return fetch(`https://api.modrinth.com/v2/teams?ids=[${teamIdsStr}]`)
    .then(response => response.json())
    .then(datas => {
        var dataObj = {};
        for(const data of datas){
            if(data.length == 0) continue;
            let teamId = data[0].team_id
            dataObj[teamId] = data.flatMap(role => role.user.username);
        }
        return dataObj;
    })
}

// returns a promise with the parsed data that we actually want
var getModData = (addon) => {
    if(addon.modrinth_url != null){
        return fetchFullModData(idFromUrl(addon.modrinth_url)).then((data) => {
            return {
                icon_url: data["icon_url"],
                platforms: data["loaders"],
                source_url: data["source_url"],
                book_url: data["wiki_url"],
                downloads: data["downloads"],
                game_versions: data["game_versions"],
                published_date: Date.parse(data["published"]),
                updated_date: Date.parse(data["updated"]),
                description: data["description"],
            };
        });
    } else {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }
}
