import "dotenv/config";
import { DiscordRequest } from "../utils.js";
import { MessageComponentTypes } from "discord-interactions";
import { locations } from "../schemas/location.js";

export async function gather(req, user, sessionId, options) {
  const { userData, sessionData, locationData } = options;
  let opt = [];
  const currentLocation = await locations.findOne({
    locationId: userData.Location,
  });
  currentLocation.data.gather.forEach((i) => {
    opt.push({
      label: i.name,
      value: `gather_${i.name}_${sessionId}`,
      description: i.drop,
    });
  });
  await DiscordRequest(
    `/webhooks/${process.env.APP_ID}/${sessionData.token}/messages/@original`,
    {
      method: "PATCH",
      body: {
        embeds: [
          {
            title: "Resource gathering",
            description:
              "Select a resource gathering method from the selection bar below to start gathering different resources in your current location.",
            thumbnail: {
              url: "https://art.pixilart.com/sr227704e0209aws3.png",
            },
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.STRING_SELECT,
                custom_id: "gather_bar",
                min_values: 1,
                max_values: 1,
                placeholder: "Select a resource gathering method",
                options: opt,
              },
            ],
          },
        ],
      },
    }
  );
}
