import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { Deployment, ServiceType, Volume, Secret, ServicePort, EnvFrom } from 'cdk8s-plus-22';
//import { Deployment, ServiceType, ServicePort, Protocol } from 'cdk8s-plus-22';


export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    const starkbotEnvSecret = Secret.fromSecretName(scope, id, 'prod/starkbot/bot');

    const starkbotDeployment = new Deployment(this, "starkbot");

    starkbotDeployment.addContainer(
      {
        image: "071785475400.dkr.ecr.eu-west-3.amazonaws.com/starkbot-repository",
        name: 'starkbot',
        port: 80,
        volumeMounts: [
          {
            path:'/tmp',
            volume:Volume.fromEmptyDir(scope, id="tmp-starkbot", 'tmp-starkbot'),
          },
        ],
        envFrom: [new EnvFrom(starkbotEnvSecret)],
      }
    )

    /*const exposePortWordPress : ServicePort = {
      port: 80,
    };

    starkbotDeployment.exposeViaService({
      ports: [exposePortWordPress],
      serviceType: ServiceType.LOAD_BALANCER,
      name: "starkbot-service",
    });*/

    /*const sec_db = new Secret(this, "mysql-pass", {stringData: {
      ["password"]: "vY42$5wP6p0+ua",
    }});

    const wordpressDeployment = new Deployment(this, "wordpress");

    wordpressDeployment.addContainer(
      {
        image: 'wordpress',
        name: 'wordpress',
        port:80,
        volumeMounts: [
          {
            path:'/var/www/html',
            volume:Volume.fromEmptyDir(scope, id="dir-wordpress", 'dir-wordpress'),
          },
          {
            path:'/tmp',
            volume:Volume.fromEmptyDir(scope, id="tmp-wordpress", 'tmp-wordpress'),
          },
          {
            path: '/var/run/apache2',
            volume:Volume.fromEmptyDir(scope, id="apache-wordpress", 'apache-wordpress'),
          }
        ],
        envVariables: {
          ["WORDPRESS_DB_HOST"]: EnvValue.fromValue("wordpress-mysql"),
          ["WORDPRESS_DB_USER"]: EnvValue.fromValue("root"),
          ["WORDPRESS_DB_PASSWORD"]: EnvValue.fromSecretValue({key: "password", secret: sec_db}),
        }
      }
    )

    const exposePortWordPress : ServicePort = {
      port: 80,
    };

    wordpressDeployment.exposeViaService({
      ports: [exposePortWordPress],
      serviceType: ServiceType.LOAD_BALANCER,
      name: "wordpress-service",
    });*/

    /*const mySQLDeployment = new Deployment(this, "my-sql");

    mySQLDeployment.addContainer(
      {
        image: 'mysql', 
        name: 'mysql',
        port:3306, 
        volumeMounts: 
        [
          {
            path:'/var/lib/mysql',
            volume:Volume.fromEmptyDir(scope, "dirdb", 'dirdb'),
          },
          {
            path:'/tmp',
            volume:Volume.fromEmptyDir(scope, "tmp-sql", 'tmp-sql'),
          },
          {
            path:'/var/run/mysqld',
            volume:Volume.fromEmptyDir(scope, "dirdb2", 'dirdb2'),
          }
        ],
        envVariables: {
          ["MYSQL_ROOT_PASSWORD"]: EnvValue.fromSecretValue({key: "password", secret: sec_db}),
        }
      }
    );

    const exposePortSQL : ServicePort = {
      port: 3306,
    };

    mySQLDeployment.exposeViaService({
      ports: [exposePortSQL],
      serviceType: undefined,
      name: "wordpress-mysql",
    });*/

  }
}

const app = new App();
new MyChart(app, 'kube');
app.synth();
