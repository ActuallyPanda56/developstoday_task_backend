import { Request, Response } from "express";

export const getCountries = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://date.nager.at/api/v3/AvailableCountries");
    const flagResponse = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");

    if (!response.ok || !flagResponse.ok) {
      return res.status(response.status).json({ message: "Error fetching countries" });
    }

    const countries = await response.json();
    const flags = await flagResponse.json();
    const countriesWithFlags = countries.map((country: any) => {
      const flag = flags.data.find((flag: any) => flag.name === country.name);
      return {
        ...country,
        flagUrl: flag ? flag.flag : "Flag URL not found"
      };
    });
    res.status(200).json(countriesWithFlags);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
};

export interface Flag {
  name: string;
  flag: string;
  iso2: string;
  iso3: string;
}

export const getCountryFlags = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");

    if (!response.ok) {
      return res.status(response.status).json({ message: "Error fetching flags" });
    }

    const data = await response.json();
    const flags: Flag[] = data.data; // Assuming the flags array is within the 'data' property

    console.log(flags);

    // Modify Vatican City's flag URL to end with .svg
    const vaticanCityFlagIndex = flags.findIndex(
      (flag) => flag.name === "Vatican City State (Holy See)" || flag.iso2 === "VA"
    );
    if (vaticanCityFlagIndex !== -1) {
      flags[vaticanCityFlagIndex].flag = flags[vaticanCityFlagIndex].flag.replace(/\.png$/, "");
    }

    res.status(200).json(flags);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
};

interface Border {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
}

export const getCountryInfo = async (req: Request, res: Response) => {
  const { countryCode } = req.params;

  try {
    // Fetch country info
    const countryInfoResponse = await fetch(
      `https://date.nager.at/api/v3/CountryInfo/${countryCode}`
    );
    if (!countryInfoResponse.ok) {
      return res
        .status(countryInfoResponse.status)
        .json({ message: "Error fetching country info" });
    }
    const countryInfo = await countryInfoResponse.json();

    // Fetch population data
    const populationResponse = await fetch(
      "https://countriesnow.space/api/v0.1/countries/population"
    );
    if (!populationResponse.ok) {
      return res
        .status(populationResponse.status)
        .json({ message: "Error fetching population data" });
    }
    const populationData = await populationResponse.json();

    const countryPopulation = populationData.data.find(
      (item: any) => item.country === countryInfo.commonName
    );

    // Fetch flag data
    const flagResponse = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");
    if (!flagResponse.ok) {
      return res.status(flagResponse.status).json({ message: "Error fetching flag data" });
    }
    const flagData = await flagResponse.json();

    const countryFlag = flagData.data.find((item: any) => item.name === countryInfo.commonName);

    console.log(countryFlag);

    const bordersWithFlags = countryInfo.borders.map((border: Border) => {
      const borderFlag = flagData.data.find((item: any) => item.iso2 === border.countryCode);
      return {
        ...border,
        flagUrl: borderFlag ? borderFlag.flag : "Flag URL not found"
      };
    });

    const result = {
      name: countryInfo.commonName,
      borders: bordersWithFlags,
      population: countryPopulation
        ? countryPopulation.populationCounts
        : "Population data not found",
      flagUrl: countryFlag ? countryFlag.flag : null
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
};
