import glob from "glob"
import path from "path"
import resolveCwd from "resolve-cwd"
import { asFunction } from "awilix"
import formatRegistrationName from "../utils/format-registration-name"
import { ConfigModule, MedusaContainer } from "../types/global"
import { isDefined } from "../utils"

type Options = {
  container: MedusaContainer
  configModule: ConfigModule
  isTest?: boolean
}

const servicesDefinition = {
  user: {
    registration: "userService",
    defaultPackage: "@medusajs/users",
    label: "UserService",
    validation: (proto: any): boolean => {
      return true
    },
    required: false,
    canOverride: true,
  },
}

/**
 * Registers all services in the services directory
 */
export default async ({
  container,
  configModule,
  isTest,
}: Options): Promise<void> => {
  const useMock = isDefined(isTest) ? isTest : process.env.NODE_ENV === "test"

  const corePath = useMock ? "../services/__mocks__/*.js" : "../services/*.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn).default
    if (loaded) {
      const name = formatRegistrationName(fn)
      container.register({
        [name]: asFunction(
          (cradle) => new loaded(cradle, configModule)
        ).singleton(),
      })
    }
  })

  console.log("Loading services from plugins")

  console.log(configModule)
  const services = configModule.services || {}
  console.log("Project Services", services)
  for (const [name, settings] of Object.entries(servicesDefinition)) {
    console.log("Checking for service", name)

    if (settings.canOverride && name in services) {
      console.log("Overriding service", name)
      const servicePath = resolveCwd(services[name])
      console.log("Importing from", servicePath)
      const mod = await import(servicePath)
      const loaded = mod.default

      if (loaded) {
        if (!settings.validation(loaded)) {
          throw new Error(
            `Service ${name} does not match the expected interface`
          )
        }

        container.register({
          [settings.registration]: asFunction(
            (cradle) => new loaded(cradle, configModule)
          ).singleton(),
        })
      }
    } else {
      console.log("Using default service", name)

      // @ts-ignore
      const mod = await import(settings.defaultPackage)
      const loaded = mod.default

      console.log("Found default", loaded)

      if (loaded) {
        container.register({
          [settings.registration]: asFunction(
            (cradle) => new loaded(cradle, configModule)
          ).singleton(),
        })
      } else {
        if (settings.required) {
          throw new Error(`A ${settings.label} is required but not registered.`)
        }

        console.log("No user service found")
      }
    }
  }
}
