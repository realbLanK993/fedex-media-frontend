import ArticlesList from "@/components/articles";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  return (
    <div className="flex gap-4 p-4 w-full">
      <div className="w-[50%] flex flex-col gap-4">
        <p className="font-light text-xl">Daily Briefing</p>
        <ScrollArea className=" h-[calc(100vh-450px)] ">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nisi
            cupiditate, suscipit odit in porro, vel aliquam ratione eius,
            laborum dolorem. Mollitia excepturi laudantium earum magnam dolore
            quae molestiae modi sit dicta accusamus, at voluptatem iste velit
            repellat, itaque cupiditate quidem perspiciatis fugiat illo id.
            Culpa animi sint ipsam ab!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti
            quaerat hic nostrum autem excepturi fugiat sapiente odio nisi error
            animi, dolorum expedita veritatis repudiandae laudantium molestias
            cum et aut asperiores assumenda dicta. Quod, sed, dolores corrupti
            quibusdam iste nobis porro laborum magni quas amet labore itaque
            dolore alias ullam fugiat in unde dolorem deleniti provident eius.
            Aliquid voluptas vitae, debitis minus, praesentium suscipit
            temporibus nobis rerum nesciunt repellendus ab tempore asperiores
            quibusdam. Vero, quisquam consequatur.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
            odio possimus labore voluptatem aspernatur? Iure aperiam delectus
            laudantium laboriosam. Mollitia libero error tempora numquam
            suscipit.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            quia nesciunt debitis neque deleniti cum? Provident, excepturi cum
            itaque illum deserunt incidunt, ipsa doloremque sunt perferendis
            maxime necessitatibus, reprehenderit est.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            quia nesciunt debitis neque deleniti cum? Provident, excepturi cum
            itaque illum deserunt incidunt, ipsa doloremque sunt perferendis
            maxime necessitatibus, reprehenderit est.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            quia nesciunt debitis neque deleniti cum? Provident, excepturi cum
            itaque illum deserunt incidunt, ipsa doloremque sunt perferendis
            maxime necessitatibus, reprehenderit est.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            quia nesciunt debitis neque deleniti cum? Provident, excepturi cum
            itaque illum deserunt incidunt, ipsa doloremque sunt perferendis
            maxime necessitatibus, reprehenderit est.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            quia nesciunt debitis neque deleniti cum? Provident, excepturi cum
            itaque illum deserunt incidunt, ipsa doloremque sunt perferendis
            maxime necessitatibus, reprehenderit est.
          </p>
        </ScrollArea>
        <div className="flex flex-col">
          <Button>Learn More</Button>
        </div>
      </div>

      <div className="h-full w-full">
        <ArticlesList />
      </div>
    </div>
  );
}
